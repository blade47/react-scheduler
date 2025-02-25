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
            babel: {
                plugins: ['@emotion/babel-plugin'],
                presets: [
                    ['@babel/preset-react', { runtime: 'automatic' }],
                ],
            }
        }),
        dts({
            include: ['src/lib'],
            exclude: ['src/demo', 'src/lib/**/*.test.tsx', 'src/lib/**/*.test.ts'],
            rollupTypes: true,
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/lib/index.tsx'),
            name: 'ReactScheduler',
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
                '@mui/icons-material',
                '@emotion/react',
                '@emotion/styled',
                'dayjs',
                'rrule',
                ...Object.keys(packageJson.peerDependencies || {})
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime',
                    'react/jsx-dev-runtime': 'jsxDevRuntime',
                    '@mui/material': 'MaterialUI',
                    '@mui/icons-material': 'MaterialUIIcons',
                    '@emotion/react': 'EmotionReact',
                    '@emotion/styled': 'EmotionStyled',
                    'dayjs': 'dayjs',
                    'rrule': 'rrule'
                },
                manualChunks: undefined,
                inlineDynamicImports: false,
                banner: '/*! @blade47/react-scheduler - MIT License */',
            },
        },
        sourcemap: false,
        emptyOutDir: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        cssCodeSplit: true,
        cssMinify: true,
    },
    resolve: {
        dedupe: [
            'react',
            'react-dom',
            '@mui/material',
            '@emotion/react',
            '@emotion/styled',
            'dayjs',
            'rrule'
        ],
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        include: ['@emotion/react', '@emotion/styled', '@mui/material']
    }
});
