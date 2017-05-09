
using System;
using Newtonsoft.Json;

namespace server {
    
    public class UTCDateTimeConverter : Newtonsoft.Json.JsonConverter {
        private TimeZoneInfo pacificZone = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");
        public override bool CanConvert(Type objectType) {
            return objectType == typeof(DateTime);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) {
            if (reader.Value == null) return null;
            var pacificTime = DateTime.Parse(reader.Value.ToString());
            return TimeZoneInfo.ConvertTime(pacificTime, pacificZone);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
            writer.WriteValue(TimeZoneInfo.ConvertTime((DateTime) value, pacificZone));
        }
    }
}
