from django.contrib import admin
from .models import Track, Author, AuthorsCollection, UsersCollection

admin.site.register(Track)
admin.site.register(Author)
admin.site.register(AuthorsCollection)
admin.site.register(UsersCollection)
