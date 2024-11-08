from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Room
from django.contrib.auth.models import User

def room_list(request):
    rooms = Room.objects.all().values('name')
    return JsonResponse(list(rooms), safe=False)

class RoomCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_name = request.data.get('name')

        if not room_name:
            return Response({'error': 'Room name is required'}, status=status.HTTP_400_BAD_REQUEST)

        if Room.objects.filter(name=room_name).exists():
            return Response({'error': 'Room already exists'}, status=status.HTTP_400_BAD_REQUEST)

        room = Room.objects.create(name=room_name, created_by=request.user)
        return Response({'message': 'Room created', 'name': room.name}, status=status.HTTP_201_CREATED)

