#!/bin/bash

echo "=== Script para atualizar repositório Git remoto ==="
echo

# Verifica se está em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Erro: Este diretório não é um repositório Git!"
    exit 1
fi

# Solicita a nova URL do repositório
echo "Por favor, insira a nova URL do repositório Git:"
read git_url

# Valida se a URL foi fornecida
if [ -z "$git_url" ]; then
    echo "Erro: URL não fornecida!"
    exit 1
fi

# Atualiza a URL do repositório remoto
echo "Atualizando URL do repositório remoto..."
if ! git remote set-url origin "$git_url"; then
    echo "Erro ao atualizar a URL do repositório!"
    exit 1
fi

# Adiciona todas as alterações
echo "Adicionando todas as alterações..."
git add .

# Solicita mensagem do commit
echo "Digite a mensagem para o commit:"
read commit_message

# Usa uma mensagem padrão se nenhuma for fornecida
if [ -z "$commit_message" ]; then
    commit_message="Atualização automática via script"
fi

# Realiza o commit
echo "Realizando commit..."
if ! git commit -m "$commit_message"; then
    echo "Aviso: Nenhuma alteração para commit ou erro ao realizar commit"
fi

# Envia as alterações para o novo repositório
echo "Enviando alterações para o novo repositório..."
if ! git push -u origin master; then
    # Se falhar com 'master', tenta com 'main'
    if ! git push -u origin main; then
        echo "Erro ao enviar alterações! Verifique suas credenciais e a URL do repositório."
        exit 1
    fi
fi

echo
echo "=== Processo concluído com sucesso! ==="
echo "Nova URL do repositório: $git_url"