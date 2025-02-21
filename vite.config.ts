import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import * as packageJson from './package.json';
import path from 'path';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
        }),
        dts({
            include: ['src/lib'],
            exclude: ['src/demo', 'src/lib/**/*.test.tsx', 'src/lib/**/*.test.ts'],
            rollupTypes: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/lib/index.tsx'),
            name: 'ReactSchedulerV2',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'react/jsx-dev-runtime',
                '@mui/material',
                ...Object.keys(packageJson.peerDependencies || {})
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime',
                    'react/jsx-dev-runtime': 'jsxDevRuntime',
                    '@mui/material': 'MaterialUI',
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
    resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './src'),
        },
    }
});
