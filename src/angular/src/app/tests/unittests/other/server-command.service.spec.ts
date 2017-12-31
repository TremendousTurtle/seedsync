import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import {LoggerService} from "../../../common/logger.service";
import {ServerCommandService} from "../../../other/server-command.service";
import {MockStreamServiceRegistry} from "../../mocks/mock-stream-service.registry";
import {RestService} from "../../../other/rest.service";
import {ConnectedService} from "../../../other/connected.service";
import {StreamServiceRegistry} from "../../../common/stream-service.registry";


describe("Testing server command service", () => {
    let mockRegistry: MockStreamServiceRegistry;
    let httpMock: HttpTestingController;
    let commandService: ServerCommandService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ServerCommandService,
                LoggerService,
                RestService,
                ConnectedService,
                {provide: StreamServiceRegistry, useClass: MockStreamServiceRegistry}
            ]
        });

        mockRegistry = TestBed.get(StreamServiceRegistry);
        httpMock = TestBed.get(HttpTestingController);
        commandService = TestBed.get(ServerCommandService);

        // Connect the services
        mockRegistry.connect();

        // Finish test config init
        commandService.onInit();
    });

    it("should create an instance", () => {
        expect(commandService).toBeDefined();
    });


    it("should send a GET restart command", () => {
        let count = 0;
        commandService.restart().subscribe({
           next: reaction => {
               count++;
               expect(reaction.success).toBe(true);
           }
        });

        // set request
        httpMock.expectOne("/server/command/restart").flush("{}");

        expect(count).toBe(1);
        httpMock.verify();
    });
});
