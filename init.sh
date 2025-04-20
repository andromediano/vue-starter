#!/bin/zsh

source $HOME/.config/colors.sh

export PROJECT_CODE="vue-starter"
export POSTGRES_DATA_PATH="${HOME}/development/podman/${PROJECT_CODE}/postgresql/data"
SECRET_FILE="secret.yaml"

# pod.yaml 생성
envsubst < pod.template.yaml > pod.yaml

# Secret 파일 확인
if [ ! -f "$SECRET_FILE" ]; then
  echo "${RC_33}Error: Secret file $SECRET_FILE not found.${CR}"
  exit 1
fi

# # Secret에서 postgres-data-path 추출
# POSTGRES_DATA_PATH=$(podman secret inspect my-secret --format '{{.Spec.Data.postgres-data-path}}' 2>/dev/null)
# if [ -z "$POSTGRES_DATA_PATH" ]; then
#   echo "Error: Failed to retrieve postgres-data-path from secret."
#   exit 1
# fi

# # 템플릿 파일 확인
# TEMPLATE_FILE="pod.template.yaml"
# OUTPUT_FILE="pod.yaml"
# if [ ! -f "$TEMPLATE_FILE" ]; then
#   echo "Error: Template file $TEMPLATE_FILE not found."
#   exit 1
# fi

# 데이터 디렉토리 생성
mkdir -p "$POSTGRES_DATA_PATH"

# # YAML 생성
# sed -e "s|__POSTGRES_DATA_PATH__|$POSTGRES_DATA_PATH|g" \
#     "$TEMPLATE_FILE" > "$OUTPUT_FILE"

# # Secret 및 Pod 적용
# podman play kube secret.yaml
# podman pod rm -f vue-starter-pod 2> /dev/null
# podman play kube pod.yaml

# echo "Pod vue-starter-pod started with postgres-data-path=$POSTGRES_DATA_PATH"
