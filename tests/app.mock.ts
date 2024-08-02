import {Application} from "../src/app";
import { beforeEach} from "vitest";

let application: Application;

beforeEach(async () => {
    console.log("Starting application")
    application = await Application.initialize();
})

export {application}