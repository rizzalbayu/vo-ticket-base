import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord, RecordMetadata } from 'kafkajs';

@Injectable()
export class ProducerService {
  private Kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
    this.Kafka = new Kafka({
      brokers: [this.configService.get<string>('KAFKA_BROKERS')],
    });
    this.producer = this.Kafka.producer();
  }

  async produce(data: ProducerRecord): Promise<RecordMetadata[]> {
    console.log(`send message to kafka with data: ${JSON.stringify(data)}`);
    return await this.producer.send(data);
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
