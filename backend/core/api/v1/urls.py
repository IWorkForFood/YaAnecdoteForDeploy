from django.urls import path, include

urlpatterns = [
    path("accounts/", include('core.api.v1.accounts.urls')),
    path("music/", include('core.api.v1.music.urls'))
]