import { FastifyReply, FastifyRequest } from "fastify";
import { GetDashboardMetricsDTO } from "../../../application/dto/dashboard/DashboardDTOs";
import { GetDashboardMetricUseCase } from "../../../application/use-cases/dashboard/GetDashboardMetricUseCase";
export class DashboardController {
  constructor(
    private getDashboardMetricUseCase: GetDashboardMetricUseCase
  ) {}

  async getDashboardMetrics(request: FastifyRequest, reply: FastifyReply): Promise<Response> {
    try {
        const dashboardMetrics = await this.getDashboardMetricUseCase.execute()
        return reply.status(200).send(dashboardMetrics)
    } catch (error) {
        return reply.status(500).send({message: 'Internal server error'})
    }
  }
}
