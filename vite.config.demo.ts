import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { searchForWorkspaceRoot } from 'vite';

export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname, 'src/demo'),
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            'react': resolve(__dirname, 'src/demo/node_modules/react'),
            'react-dom': resolve(__dirname, 'src/demo/node_modules/react-dom')
        },
        dedupe: ['react', 'react-dom']
    },
    build: {
        outDir: resolve(__dirname, 'dist/demo'),
        emptyOutDir: true
    },
    server: {
        fs: {
            allow: [
                searchForWorkspaceRoot(process.cwd()),
                resolve(__dirname, './node_modules'),
                resolve(__dirname, '../node_modules')
            ]
        },
        open: true,
        watch: {
            usePolling: true
        }
    }
});
