import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { searchForWorkspaceRoot } from 'vite';

export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname, 'src/demo'),
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        }
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
