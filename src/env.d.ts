// Add required environment variables here
declare module 'bun' {
	interface Env {
		TOKEN_SECRET: string;
	}
}
