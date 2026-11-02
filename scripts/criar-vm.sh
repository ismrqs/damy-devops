
#!/bin/bash
set -euo pipefail

RG="rg-damy-devops"
VM="vm-damy-devops"
LOCATION="brazilsouth"
ADMIN="azureuser"

echo "Criando grupo de recursos..."

az group create \
  --name "$RG" \
  --location "$LOCATION"

echo "Criando maquina virtual..."

az vm create \
  --resource-group "$RG" \
  --name "$VM" \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username "$ADMIN" \
  --authentication-type ssh \
  --generate-ssh-keys \
  --public-ip-sku Standard

echo "Configurando porta HTTP da API..."

az vm open-port \
  --resource-group "$RG" \
  --name "$VM" \
  --port 3000 \
  --priority 1010

echo "Verificando maquina virtual..."

az vm show \
  --resource-group "$RG" \
  --name "$VM" \
  --show-details \
  --output table

echo "Obtendo IP publico..."

az vm list-ip-addresses \
  --resource-group "$RG" \
  --name "$VM" \
  --output table

echo "Provisionamento finalizado."
