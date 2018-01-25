"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const http_1 = require("http");
const execa = require('execa');
ava_1.default('it runs a query from stdin', (t) => __awaiter(this, void 0, void 0, function* () {
    const server = http_1.createServer((req, res) => res.end(`
<html>
<head>
<title>some test site</title>
</head>
<body>
<main>looking good</main>
</body>
</html>
`));
    server.listen(13338);
    const query = `
{
  page(url: "http://localhost:13338") {
    title: text(selector: "title")
    main: text(selector: "main")
  }
}
  `;
    const output = yield execa.stdout('./bin.js', ['--json'], { input: query });
    t.snapshot(output);
    server.close();
}));
ava_1.default('it runs a query from a file', (t) => __awaiter(this, void 0, void 0, function* () {
    const output = yield execa.stdout('./bin.js', [
        'examples/source.graphql',
        '--json',
    ]);
    t.snapshot(output);
}));
ava_1.default('it formats output nicely', (t) => __awaiter(this, void 0, void 0, function* () {
    const output = yield execa.stdout('./bin.js', ['examples/source.graphql']);
    t.snapshot(output);
}));
ava_1.default('it formats errors nicely', (t) => __awaiter(this, void 0, void 0, function* () {
    const output = yield execa.stdout('./bin.js', { input: 'garbage' });
    t.snapshot(output);
}));
//# sourceMappingURL=bin.js.map