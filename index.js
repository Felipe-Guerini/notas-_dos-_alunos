import http from "http";
import { v4 } from "uuid";

const port = 3000;
const notas = [];

const server = http.createServer((request, response) => {
  const { method, url } = request;
  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", () => {
    const parts = url.split("/");
    const id = parts[2];

    if (url === "/notas" && method === "GET") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(notas));
    } else if (url === "/notas" && method === "POST") {
      const { nome, materia, nota } = JSON.parse(body);
      const novaNota = { id: v4(), nome, materia, nota };
      notas.push(novaNota);
      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(JSON.stringify(novaNota));
    } else if (url.startsWith("/notas/") && method === "PUT") {
      const { nome, materia, nota } = JSON.parse(body);
      const notaToUpdate = notas.find((n) => n.id === id);

      if (notaToUpdate) {
        notaToUpdate.nome = nome;
        notaToUpdate.materia = materia;
        notaToUpdate.nota = nota;
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(notaToUpdate));
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ mensagem: "Nota não encontrada" }));
      }
    } else if (url.startsWith("/notas/") && method === "DELETE") {
      const indexToDelete = notas.findIndex((n) => n.id === id);

      if (indexToDelete !== -1) {
        notas.splice(indexToDelete, 1);
        response.writeHead(204);
        response.end();
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ mensagem: "Nota não encontrada" }));
      }
    } else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ mensagem: "Rota não encontrada" }));
    }
  });
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
