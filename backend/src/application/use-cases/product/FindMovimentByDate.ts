import { IProductRepository} from "../../../domain/repositories/IProductRepository";
import { stockMovement } from "../../dto/product/StockMovimentResponse";
import { FindMovimentInput } from "../../dto/product/FindMovimentInput";
import { parseISO, isValid } from "date-fns";

export class FindMovimentByDateUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(data: FindMovimentInput): Promise<stockMovement[]> {

    const parsedDate = parseISO(data.date);

    if (!isValid(parsedDate)) {
      throw new Error("Data inválida. Use o formato YYYY-MM-DD.");
    }

    const input = {
      date: parsedDate,
      type: data.type ?? null,
    };

        return await this.productRepository.findMovimentByDate(input)
    }
}