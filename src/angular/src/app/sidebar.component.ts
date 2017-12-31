import {Component, OnInit} from "@angular/core";

import {ROUTE_INFOS} from "./routes";
import {ServerCommandService} from "./other/server-command.service";
import {LoggerService} from "./common/logger.service";
import {ConnectedService} from "./other/connected.service";
import {StreamServiceRegistry} from "./common/stream-service.registry";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"]
})

export class SidebarComponent implements OnInit {
    routeInfos = ROUTE_INFOS;

    public commandsEnabled: boolean;

    private _connectedService: ConnectedService;

    constructor(private _logger: LoggerService,
                _streamServiceRegistry: StreamServiceRegistry,
                private _commandService: ServerCommandService) {
        this._connectedService = _streamServiceRegistry.connectedService;
        this.commandsEnabled = false;
    }

    // noinspection JSUnusedGlobalSymbols
    ngOnInit() {
        this._connectedService.connected.subscribe({
            next: (connected: boolean) => {
                this.commandsEnabled = connected;
            }
        });
    }

    onCommandRestart() {
        this._commandService.restart().subscribe({
            next: reaction => {
                if (reaction.success) {
                    this._logger.info(reaction.data);
                } else {
                    this._logger.error(reaction.errorMessage);
                }
            }
        });
    }
}
