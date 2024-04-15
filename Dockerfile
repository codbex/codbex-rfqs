# Docker descriptor for codbex-opportunities
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.17.0

COPY codbex-rfqs target/dirigible/repository/root/registry/public/codbex-rfqs
COPY codbex-rfqs-data target/dirigible/repository/root/registry/public/codbex-rfqs-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-rfqs/gen/index.html