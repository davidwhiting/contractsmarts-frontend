# ContractSmarts Excel Add-in Installation Guide

## Prerequisites

Before installing the ContractSmarts Excel Add-in, ensure you have the following:

1. Node.js (v18 or higher)
2. npm (v9 or higher)
3. Microsoft Excel (2016 or higher)
4. Git (for development)

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/excel-addin-fluent.git
cd excel-addin-fluent
```

2. Install dependencies:
```bash
npm install
```

3. Install development certificates (required for Office Add-in development):
```bash
npm run dev-certs
```

4. Build the project:
```bash
npm run build
```

5. Start the development server:
```bash
npm run dev
```

## Running the Add-in

### Development Mode

1. Start the development server:
```bash
npm run start
```

This will:
- Start the Vite development server
- Launch Excel with the add-in sideloaded
- Enable hot module reloading for development

### Production Build

1. Create a production build:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Troubleshooting

### Common Issues

1. Certificate Issues
- If you encounter SSL certificate errors, run:
```bash
npm run dev-certs
```

2. Port Conflicts
- The development server runs on port 3000 by default
- If port 3000 is in use, modify `vite.config.ts` to use a different port

3. Excel Loading Issues
- Ensure Office.js is properly loaded in your HTML files
- Check that the manifest.xml is properly configured
- Verify the add-in appears in Excel's "My Add-ins" section

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Review the Excel Add-in debugging documentation
3. Contact support at support@contractsmarts.ai

## Next Steps

After installation:
1. Review the configuration guide
2. Check the API documentation
3. Explore the example components
