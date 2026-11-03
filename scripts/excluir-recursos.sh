
#!/bin/bash
set -euo pipefail

RG="rg-damy-devops"

echo "Verificando grupo de recursos..."

az group show \
  --name "$RG" \
  --output table

echo "Excluindo grupo de recursos..."

az group delete \
  --name "$RG" \
  --yes

echo "Confirmando exclusao..."

az group exists --name "$RG"

echo "Processo finalizado."
