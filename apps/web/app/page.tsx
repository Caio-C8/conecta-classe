import { Aluno } from "@repo/types";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const res = await fetch("http://localhost:3001/alunos", {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Erro ao buscar aluno: {await res.text()}</div>;
  }

  const dados = await res.json();

  const alunos: Aluno[] = dados.dados;

  async function create(formData: FormData) {
    "use server";
    const usuario = formData.get("usuario") as string;
    if (!usuario) return;

    try {
      await fetch("http://localhost:3001/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario }),
      });
      console.log("Aluno criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
    }

    revalidatePath("/");
  }

  return (
    <div className="p-5">
      <form action={create}>
        <input
          name="usuario"
          placeholder="Nome do usuário"
          required
          style={{ marginRight: "8px" }}
        />
        <button className="cursor-pointer" type="submit">
          Criar Usuário
        </button>
      </form>
      <br />

      {alunos.length > 0 ? (
        alunos.map((aluno) => (
          <div key={aluno.id}>
            <h1>{aluno.id}</h1>

            <h1>{aluno.usuario?.nome || "Sem nome"}</h1>
            <h1>{aluno.usuario?.usuario || "Sem usuário"}</h1>
            <h1>{aluno.usuario?.papel || "Sem papel"}</h1>
            <h1>{aluno.usuario_id}</h1>

            <h1>
              {aluno.created_at ? new Date(aluno.created_at).toISOString() : ""}
            </h1>
            <h1>
              {aluno.updated_at ? new Date(aluno.updated_at).toISOString() : ""}
            </h1>
            <h1>
              {aluno.deleted_at
                ? new Date(aluno.deleted_at).toISOString()
                : "Não deletado"}
            </h1>
            <br />
            <br />
            <br />
          </div>
        ))
      ) : (
        <h1>Nenhum aluno encontrado</h1>
      )}
    </div>
  );
}
