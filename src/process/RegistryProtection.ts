/**
 * DreamCrafter7 - Registry Protection System
 * Protects the Remotion registry from corruption with:
 * - Automatic backups before modifications
 * - Validation after modifications
 * - Rollback capability on failure
 */

import * as fs from 'fs';
import * as path from 'path';

export interface RegistryBackup {
  timestamp: string;
  content: string;
  checksum: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class RegistryProtection {
  private registryPath: string;
  private backupDir: string;
  private maxBackups = 10;

  constructor() {
    const workspaceRoot = process.cwd();
    this.registryPath = path.join(workspaceRoot, 'src/remotion/clones/registry.ts');
    this.backupDir = path.join(workspaceRoot, '.registry-backups');
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Calculate simple checksum for content verification
   */
  private calculateChecksum(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Create a backup of the current registry
   */
  createBackup(): RegistryBackup | null {
    try {
      if (!fs.existsSync(this.registryPath)) {
        console.warn('[RegistryProtection] Registry file not found, cannot create backup');
        return null;
      }

      const content = fs.readFileSync(this.registryPath, 'utf-8');
      const checksum = this.calculateChecksum(content);
      
      const backup: RegistryBackup = {
        timestamp: new Date().toISOString(),
        content,
        checksum
      };

      // Save backup file
      const backupFileName = `registry_${Date.now()}.json`;
      const backupPath = path.join(this.backupDir, backupFileName);
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

      // Clean old backups
      this.cleanOldBackups();

      console.log(`[RegistryProtection] Backup created: ${backupFileName}`);
      return backup;
    } catch (error) {
      console.error('[RegistryProtection] Failed to create backup:', error);
      return null;
    }
  }

  /**
   * Clean old backups, keeping only the most recent ones
   */
  private cleanOldBackups(): void {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('registry_') && f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(this.backupDir, f),
          time: fs.statSync(path.join(this.backupDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      // Remove old backups beyond maxBackups
      if (files.length > this.maxBackups) {
        files.slice(this.maxBackups).forEach(f => {
          fs.unlinkSync(f.path);
          console.log(`[RegistryProtection] Removed old backup: ${f.name}`);
        });
      }
    } catch (error) {
      console.warn('[RegistryProtection] Failed to clean old backups:', error);
    }
  }

  /**
   * Restore from the most recent backup
   */
  restoreFromBackup(): boolean {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('registry_') && f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(this.backupDir, f),
          time: fs.statSync(path.join(this.backupDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      if (files.length === 0) {
        console.error('[RegistryProtection] No backups found to restore from');
        return false;
      }

      const latestBackup = files[0];
      const backupData: RegistryBackup = JSON.parse(
        fs.readFileSync(latestBackup.path, 'utf-8')
      );

      // Verify checksum
      const currentChecksum = this.calculateChecksum(backupData.content);
      if (currentChecksum !== backupData.checksum) {
        console.error('[RegistryProtection] Backup checksum mismatch, file may be corrupted');
        return false;
      }

      // Restore content
      fs.writeFileSync(this.registryPath, backupData.content);
      console.log(`[RegistryProtection] Restored from backup: ${latestBackup.name}`);
      return true;
    } catch (error) {
      console.error('[RegistryProtection] Failed to restore from backup:', error);
      return false;
    }
  }

  /**
   * Validate the registry file structure
   */
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check file exists
      if (!fs.existsSync(this.registryPath)) {
        errors.push('Registry file does not exist');
        return { isValid: false, errors, warnings };
      }

      const content = fs.readFileSync(this.registryPath, 'utf-8');

      // Check for basic structure
      if (!content.includes('ClonedCompositions')) {
        errors.push('Missing ClonedCompositions array');
      }

      if (!content.includes('export const')) {
        errors.push('Missing export statement');
      }

      // Check for balanced braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
      }

      // Check for balanced brackets
      const openBrackets = (content.match(/\[/g) || []).length;
      const closeBrackets = (content.match(/\]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        errors.push(`Unbalanced brackets: ${openBrackets} open, ${closeBrackets} close`);
      }

      // Check for duplicate IDs
      const idMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
      if (idMatches) {
        const ids = idMatches.map(m => m.match(/id:\s*['"]([^'"]+)['"]/)?.[1]);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        if (duplicates.length > 0) {
          errors.push(`Duplicate composition IDs found: ${[...new Set(duplicates)].join(', ')}`);
        }
      }

      // Check for required fields in composition objects
      const compositionObjects = content.match(/\{[^}]+id:[^}]+\}/g);
      if (compositionObjects) {
        compositionObjects.forEach((obj, index) => {
          if (!obj.includes('component:')) {
            warnings.push(`Composition ${index} missing 'component' field`);
          }
          if (!obj.includes('durationInFrames:')) {
            warnings.push(`Composition ${index} missing 'durationInFrames' field`);
          }
          if (!obj.includes('fps:')) {
            warnings.push(`Composition ${index} missing 'fps' field`);
          }
        });
      }

    } catch (error: any) {
      errors.push(`Validation error: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Wrap a registry modification with backup and validation
   */
  async withProtection<T>(operation: () => T): Promise<T> {
    // Create backup before modification
    this.createBackup();
    
    try {
      const result = operation();
      
      // Validate after modification
      const validation = this.validate();
      if (!validation.isValid) {
        console.error('[RegistryProtection] Validation failed after modification:', validation.errors);
        
        // Attempt rollback
        console.log('[RegistryProtection] Attempting rollback...');
        if (this.restoreFromBackup()) {
          throw new Error(`Registry validation failed. Rolled back to previous state. Errors: ${validation.errors.join(', ')}`);
        } else {
          throw new Error(`Registry validation failed. Rollback failed. Original errors: ${validation.errors.join(', ')}`);
        }
      }

      if (validation.warnings.length > 0) {
        console.warn('[RegistryProtection] Validation warnings:', validation.warnings);
      }

      return result;
    } catch (error) {
      // Attempt rollback on error
      console.error('[RegistryProtection] Operation failed, attempting rollback...');
      this.restoreFromBackup();
      throw error;
    }
  }

  /**
   * Get list of available backups
   */
  getBackups(): { name: string; timestamp: string; path: string }[] {
    try {
      return fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('registry_') && f.endsWith('.json'))
        .map(f => {
          const backupPath = path.join(this.backupDir, f);
          const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
          return {
            name: f,
            timestamp: data.timestamp,
            path: backupPath
          };
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('[RegistryProtection] Failed to list backups:', error);
      return [];
    }
  }
}

// Export singleton instance
export const registryProtection = new RegistryProtection();
export default registryProtection;
