# ContractSmarts Excel Add-in Configuration Guide

## Environment Configuration

### Development Environment

1. Configure development environment variables in `.env.development`:
```env
VITE_API_URL=https://api.contractsmarts.ai
NODE_ENV=development
```

2. Configure HTTPS certificates in `vite.config.ts`:
```typescript
server: {
  port: 3000,
  https: {
    key: readFileSync(resolve(certPath, 'localhost.key')),
    cert: readFileSync(resolve(certPath, 'localhost.crt'))
  }
}
```

### Production Environment

1. Configure production environment variables in `.env.production`:
```env
VITE_API_URL=https://api.contractsmarts.ai
NODE_ENV=production
```

## Office Add-in Configuration

### Manifest Configuration (manifest.xml)

1. Update the add-in identification:
```xml
<Id>4228D1D1-D6D6-4509-89B1-2CD42B3C5D04</Id>
<Version>1.0.0.0</Version>
<ProviderName>ContractSmarts</ProviderName>
```

2. Configure icon paths:
```xml
<IconUrl DefaultValue="https://localhost:3000/assets/icon-32.png"/>
<HighResolutionIconUrl DefaultValue="https://localhost:3000/assets/icon-64.png"/>
```

3. Set up allowed domains:
```xml
<AppDomains>
  <AppDomain>https://www.contractsmarts.ai</AppDomain>
</AppDomains>
```

### API Configuration

1. Configure the API client in your application:
```typescript
const api = new ContractSmartsApi({
  baseUrl: import.meta.env.VITE_API_URL
});
```

## TypeScript Configuration

1. Configure Office.js types in `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "types": ["office-js"],
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

## ESLint Configuration

Current ESLint configuration in `eslint.config.js`:
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

## Vite Configuration

Current Vite configuration in `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        taskpane: resolve(__dirname, 'src/taskpane/taskpane.html'),
      },
    },
  },
  server: {
    port: 3000,
    https: {
      key: readFileSync(resolve(certPath, 'localhost.key')),
      cert: readFileSync(resolve(certPath, 'localhost.crt'))
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  base: process.env.NODE_ENV === 'production' 
    ? 'https://api.contractsmarts.ai/static/d/'
    : '/',
})
```

## Authentication Configuration

1. Configure Auth0 in your application:
```typescript
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain="contractsmarts.auth0.com"
    clientId="your_client_id"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://api.contractsmarts.ai"
    }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
```

## UI Components Configuration

The application uses Fluent UI React v9 components. Current configuration in package.json:
```json
{
  "dependencies": {
    "@fluentui/react-components": "^9.57.0",
    "@fluentui/react-icons": "^2.0.270"
  }
}
```

## Future Configuration

The following features will need configuration in future updates:
1. Database connections
2. File storage services
3. AI model integration
4. User roles and permissions
5. Automated testing setup
6. CI/CD pipeline configuration

These sections will be updated as new features are added to the application.
