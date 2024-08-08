import {ContainerBuilder} from "node-dependency-injection";
import registerSharedDependencies from "./shared";
import registerFriendsDependencies from "./friends";
import registerAuthDependencies from "./auth";

export default function getContainer(): ContainerBuilder {
    const container = new ContainerBuilder(true, __dirname)
    registerSharedDependencies(container)
    registerAuthDependencies(container)
    registerFriendsDependencies(container)
    return container;
}