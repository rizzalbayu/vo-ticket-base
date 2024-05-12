import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';

@Injectable()
export class ConsumerService {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly topic: ConsumerSubscribeTopics,
    config: ConsumerConfig,
  ) {
    this.kafka = new Kafka({
      brokers: [this.configService.get('KAFKA_BROKER')],
    });
    this.consumer = this.kafka.consumer(config);
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
    } catch (error) {
      console.log(error);
    }
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        console.log(`Processing ${partition}`);
        await onMessage(message);
      },
    });
  }
}
