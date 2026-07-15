/**
 * Note: dependency-cruiser only parses JS/TS modules, so imports living in
 * `.astro` files are outside its reach — Knip covers those. This config guards
 * the TypeScript module graph (src/ and tests/).
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies make modules hard to reason about and refactor safely.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "error",
      comment:
        "Modules nothing depends on are dead weight. Declaration files are exempt " +
        "(picked up by tsconfig), as are config entry points.",
      from: {
        orphan: true,
        pathNot: ["\\.d\\.ts$", "(^|/)[^/]+\\.config\\.(js|mjs|cjs|ts)$"],
      },
      to: {},
    },
    {
      name: "not-to-test",
      severity: "error",
      comment: "Production code must never depend on test code.",
      from: { path: "^src" },
      to: { path: "^tests" },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment: "Shipped code must not import devDependencies.",
      from: { path: "^src" },
      to: {
        dependencyTypes: ["npm-dev"],
        dependencyTypesNot: ["type-only"],
      },
    },
    {
      name: "no-duplicate-dep-types",
      severity: "error",
      comment: "A package listed in more than one dependency section is a mistake.",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"],
      },
    },
  ],
  options: {
    doNotFollow: { path: ["node_modules"] },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
  },
};
