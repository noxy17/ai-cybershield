from rest_framework import serializers


class ScanSerializer(serializers.Serializer):
    scan_type = serializers.ChoiceField(choices=["email", "sms", "whatsapp", "social", "url"])
    content = serializers.CharField(min_length=3, max_length=10000, trim_whitespace=True)

    def validate_content(self, value):
        blocked = ["<script", "javascript:", "onerror=", "onload="]
        lowered = value.lower()
        if any(token in lowered for token in blocked):
            raise serializers.ValidationError("Potentially unsafe markup is not allowed.")
        return value
