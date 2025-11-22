const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Cho phép Metro xem thư mục gốc (để thấy packages/core)
config.watchFolders = [workspaceRoot];

// 2. Ưu tiên node_modules của mobile, sau đó mới tìm ở root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Bắt buộc Metro xử lý code TypeScript trong monorepo
config.resolver.disableHierarchicalLookup = true;

module.exports = config;