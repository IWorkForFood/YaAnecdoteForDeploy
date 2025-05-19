from rest_framework.response import Response
from rest_framework import status
from djoser.views import UserViewSet
from django.views import View

import requests
from django.http import HttpResponseRedirect
from django.views import View
from django.urls import reverse
from django.conf import settings

class ActivationViewSendler(View):
    def get(self, request, uid, token):
        '''
        # URL для активации в Djoser
        activation_api_url = 'http://127.0.0.1:8000/api/v1/accounts/activation/'
        
        # Данные для POST-запроса
        data = {
            'uid': uid,
            'token': token
        }
        
        try:
            # Делаем POST-запрос к API Djoser
            response = requests.post(activation_api_url, data=data)
            
            if response.status_code == status.HTTP_204_NO_CONTENT:
                # Если активация успешна - перенаправляем на фронтенд
                frontend_url = f'http://localhost:5173/activate/{uid}/{token}'
                return HttpResponseRedirect(frontend_url)
            else:
                # Если ошибка - перенаправляем на фронтенд с параметром ошибки
                frontend_url = f'http://localhost:5173/activate/error?code={response.status_code}'
                return HttpResponseRedirect(frontend_url)
                
        except requests.RequestException as e:
            # В случае ошибки соединения
            frontend_url = f'http://localhost:5173/activate/error?message=connection_error'
            return HttpResponseRedirect(frontend_url)'
        '''
        return HttpResponseRedirect(f'http://localhost:80/activate/{uid}/{token}')


class ActivationView(UserViewSet):
    def activation(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception = True)
        user = serializer.user

        user.is_verified = True
        user.save()

        super().activation(request, *args, **kwargs)

        return Response(
            {"message": "Account activated succesfully"},
            status = status.HTTP_200_OK,
        )
