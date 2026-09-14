export class NotificationService {
  constructor(adapters){this.adapters=adapters}
  async deliver(intent){const adapter=this.adapters[intent.channel];if(!adapter)throw new Error('Notification channel is not configured');if(!intent.id||!intent.recipient||!intent.body)throw new Error('Incomplete notification');return adapter.deliver(intent)}
}
export class RecordingAdapter {
  records=[];
  async deliver(intent){const existing=this.records.find(x=>x.id===intent.id);if(existing)return existing;const result={...structuredClone(intent),status:'recorded',externallyDelivered:false};this.records.push(result);return result}
}
