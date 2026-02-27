import { FastifyReply, FastifyRequest } from "fastify";
import { GetDashboardMetricsDTO } from "../../../application/dto/dashboard/DashboardDTOs";
import { GetDashboardMetricUseCase } from "../../../application/use-cases/dashboard/GetDashboardMetricUseCase";
import { GetDashboardChartsUseCase } from "../../../application/use-cases/dashboard/GetDashboardChartsUseCase";

export class DashboardController {
  constructor(
    private getDashboardMetricUseCase: GetDashboardMetricUseCase,
    private getDashboardChartsUseCase: GetDashboardChartsUseCase
  ) {}

  async getDashboardMetrics(request: FastifyRequest, reply: FastifyReply): Promise<Response> {
    try {
        const query = request.query as { startDate: string; endDate: string };
        const dashboardMetrics = await this.getDashboardMetricUseCase.execute(query.startDate, query.endDate);
        return reply.status(200).send(dashboardMetrics);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
  };


  async getDashboardCharts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as { startDate: string; endDate: string };
      const dashboardCharts = await this.getDashboardChartsUseCase.execute(query.startDate, query.endDate);
      return reply.status(200).send(dashboardCharts);
    } catch (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
  }
}
