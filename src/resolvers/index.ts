import path from "path";
import { loadFiles } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";

const resolversArray2 = await loadFiles(path.join(import.meta.dir, "*"), {
  ignoreIndex: true,
  recursive: true,
});

const mergedResolvers2 = mergeResolvers(resolversArray2);

export default mergedResolvers2;
