import logging
import time

logger = logging.getLogger("cybershield.requests")


class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        started = time.perf_counter()
        response = self.get_response(request)
        duration_ms = round((time.perf_counter() - started) * 1000, 2)
        logger.info("%s %s %s %sms", request.method, request.path, response.status_code, duration_ms)
        return response
