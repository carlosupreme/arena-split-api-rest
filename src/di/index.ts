import {ContainerBuilder} from "node-dependency-injection";
import registerSharedDependencies from "./shared";
import registerFriendsDependencies from "./friends";

const container = new ContainerBuilder(true, __dirname)
registerSharedDependencies(container)
registerFriendsDependencies(container)

export default container;
