from django.urls import path
from .handlers import ActivationView, ActivationViewSendler


urlpatterns = [
    path("activation/", ActivationView.as_view({'post': 'activation'}), name="email-activation"),
    path('activate/<str:uid>/<str:token>', ActivationViewSendler.as_view()),
]