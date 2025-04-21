import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

interface RegistroSaude {
  pressaoSistolica?: number;
  pressaoDiastolica?: number;
  glicemia?: number;
  batimentosCardiacos?: number;
  observacoes?: string;
  dataHora?: Date;
}

export const salvarRegistro = async (registro: RegistroSaude) => {
  try {
    await addDoc(collection(db, "registros"), {
      ...registro,
      dataHora: registro.dataHora ? Timestamp.fromDate(new Date(registro.dataHora)) : Timestamp.now(),
    });
    console.log("Registro salvo com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar registro:", e);
  }
};
