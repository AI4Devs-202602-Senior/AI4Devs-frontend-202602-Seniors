"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var screeningType, technicalType, managerType, interviewFlow, company, position, candidates, createdCandidates, steps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Seeding test data for kanban board...');
                    return [4 /*yield*/, prisma.interviewType.create({
                            data: {
                                name: 'Phone Screening',
                                description: 'Initial phone screening'
                            }
                        })];
                case 1:
                    screeningType = _a.sent();
                    return [4 /*yield*/, prisma.interviewType.create({
                            data: {
                                name: 'Technical Interview',
                                description: 'Technical skills assessment'
                            }
                        })];
                case 2:
                    technicalType = _a.sent();
                    return [4 /*yield*/, prisma.interviewType.create({
                            data: {
                                name: 'Manager Interview',
                                description: 'Manager round discussion'
                            }
                        })];
                case 3:
                    managerType = _a.sent();
                    return [4 /*yield*/, prisma.interviewFlow.create({
                            data: {
                                description: 'Standard development interview process',
                                interviewSteps: {
                                    create: [
                                        {
                                            interviewTypeId: screeningType.id,
                                            name: 'Initial Screening',
                                            orderIndex: 1
                                        },
                                        {
                                            interviewTypeId: technicalType.id,
                                            name: 'Technical Interview',
                                            orderIndex: 2
                                        },
                                        {
                                            interviewTypeId: managerType.id,
                                            name: 'Manager Interview',
                                            orderIndex: 3
                                        },
                                    ]
                                }
                            }
                        })];
                case 4:
                    interviewFlow = _a.sent();
                    return [4 /*yield*/, prisma.company.create({
                            data: {
                                name: 'Tech Corp'
                            }
                        })];
                case 5:
                    company = _a.sent();
                    return [4 /*yield*/, prisma.position.create({
                            data: {
                                title: 'Senior Backend Engineer',
                                description: 'We are looking for a senior backend engineer with 5+ years of experience.',
                                companyId: company.id,
                                interviewFlowId: interviewFlow.id,
                                status: 'Abierto',
                                location: 'San Francisco, CA',
                                jobDescription: 'We are looking for a senior backend engineer with 5+ years of experience in Node.js, TypeScript, and cloud infrastructure.'
                            }
                        })];
                case 6:
                    position = _a.sent();
                    candidates = [
                        {
                            firstName: 'Jane',
                            lastName: 'Smith',
                            email: 'jane.smith@example.com',
                            phone: '+1234567890'
                        },
                        {
                            firstName: 'Carlos',
                            lastName: 'García',
                            email: 'carlos.garcia@example.com',
                            phone: '+1234567891'
                        },
                        {
                            firstName: 'John',
                            lastName: 'Doe',
                            email: 'john.doe@example.com',
                            phone: '+1234567892'
                        },
                        {
                            firstName: 'Maria',
                            lastName: 'Rodriguez',
                            email: 'maria.rodriguez@example.com',
                            phone: '+1234567893'
                        },
                        {
                            firstName: 'Alex',
                            lastName: 'Kim',
                            email: 'alex.kim@example.com',
                            phone: '+1234567894'
                        },
                    ];
                    return [4 /*yield*/, Promise.all(candidates.map(function (candidate) {
                            return prisma.candidate.create({
                                data: candidate
                            });
                        }))];
                case 7:
                    createdCandidates = _a.sent();
                    return [4 /*yield*/, prisma.interviewStep.findMany({
                            where: { interviewFlowId: interviewFlow.id },
                            orderBy: { orderIndex: 'asc' }
                        })];
                case 8:
                    steps = _a.sent();
                    // Create applications (assign candidates to different stages)
                    return [4 /*yield*/, Promise.all([
                            prisma.application.create({
                                data: {
                                    positionId: position.id,
                                    candidateId: createdCandidates[0].id,
                                    currentInterviewStep: steps[0].id,
                                    applicationDate: new Date(),
                                    notes: 'Strong background'
                                }
                            }),
                            prisma.application.create({
                                data: {
                                    positionId: position.id,
                                    candidateId: createdCandidates[1].id,
                                    currentInterviewStep: steps[1].id,
                                    applicationDate: new Date('2026-05-05'),
                                    notes: 'Passed screening'
                                }
                            }),
                            prisma.application.create({
                                data: {
                                    positionId: position.id,
                                    candidateId: createdCandidates[2].id,
                                    currentInterviewStep: steps[2].id,
                                    applicationDate: new Date('2026-05-03'),
                                    notes: 'Technical interview passed'
                                }
                            }),
                            prisma.application.create({
                                data: {
                                    positionId: position.id,
                                    candidateId: createdCandidates[3].id,
                                    currentInterviewStep: steps[0].id,
                                    applicationDate: new Date('2026-05-08'),
                                    notes: 'New application'
                                }
                            }),
                            prisma.application.create({
                                data: {
                                    positionId: position.id,
                                    candidateId: createdCandidates[4].id,
                                    currentInterviewStep: steps[1].id,
                                    applicationDate: new Date('2026-05-06'),
                                    notes: 'Scheduled tech interview'
                                }
                            }),
                        ])];
                case 9:
                    // Create applications (assign candidates to different stages)
                    _a.sent();
                    console.log('✓ Test data seeded successfully!');
                    console.log("\u2713 Position ID: ".concat(position.id));
                    console.log("\u2713 Created ".concat(createdCandidates.length, " candidates in kanban"));
                    console.log("\u2713 Navigate to http://localhost:3000/positions/".concat(position.id, " to view kanban"));
                    return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (e) {
    console.error('Error seeding data:', e);
    process.exit(1);
})["finally"](function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
