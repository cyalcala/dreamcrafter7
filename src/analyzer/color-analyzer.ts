import Vibrant from 'node-vibrant';
import { ColorPalette } from './types';

export class ColorAnalyzer {
    async extractColorPalette(imagePath: string): Promise<ColorPalette> {
        try {
            const palette = await Vibrant.from(imagePath).getPalette();
            const dominantColors: string[] = [];
            const population: number[] = [];

            // Sort colors by population to find truly dominant ones
            const swatches = Object.values(palette).filter((swatch) => swatch !== null);
            swatches.sort((a, b) => (b!.population || 0) - (a!.population || 0));

            // Extract top 5
            for (let i = 0; i < Math.min(swatches.length, 5); i++) {
                const swatch = swatches[i];
                if (swatch) {
                    dominantColors.push(swatch.getHex());
                    population.push(swatch.population);
                }
            }

            return {
                dominantColors,
                population,
            };
        } catch (error) {
            console.error(`Error extracting colors from ${imagePath}:`, error);
            return { dominantColors: [], population: [] };
        }
    }

    async analyzeVideoColors(keyframePaths: string[]): Promise<ColorPalette[]> {
        const palettes: ColorPalette[] = [];
        for (const path of keyframePaths) {
            palettes.push(await this.extractColorPalette(path));
        }
        return palettes;
    }
}
