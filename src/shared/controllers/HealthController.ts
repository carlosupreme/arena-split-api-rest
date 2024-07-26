import {Controller} from "../Controller";
import {Request, Response} from "express";

export class HealthController implements Controller {
    readonly message: string;

    constructor() {
        this.message = 'Server running';
    }
    async run(_req: Request, res: Response): Promise<void> {
        res.json({status: this.message});
    }
}