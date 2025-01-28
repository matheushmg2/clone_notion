import { createApi } from "unsplash-js";
import "dotenv/config";

const unsplash = createApi({
    accessKey: (process.env.UNSPLASH_API_KEY as string) || "", // Substitua pela sua chave da API
});

export const unsplashGeneration = async (query?: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await unsplash.photos.getRandom({ query });
        if (response.errors) {
            console.error("Erro:", response.errors);
            alert("Erro ao buscar imagem.");
        } else if (response.response) {
            return response.response.urls.small as string;
        }
    } catch (error) {
        console.error("Erro ao buscar a imagem:", error);
        alert("Não foi possível buscar a imagem. Tente novamente.");
    }
};
