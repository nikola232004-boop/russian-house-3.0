mkdir -p src/app
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #F8F9FC 0%, #EEF2F7 100%);
  color: #1A1A1A;
}

.glass-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #2563EB, #1D4ED8);
  padding: 12px 32px;
  border-radius: 40px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}

.input-modern {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 12px 16px;
  width: 100%;
  transition: all 0.3s ease;
}

.input-modern:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
EOF