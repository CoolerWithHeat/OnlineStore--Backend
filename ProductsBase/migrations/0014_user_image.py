# Generated by Django 4.1.7 on 2023-05-31 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProductsBase', '0013_user_supportstaff_alter_user_channellayer'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image',
            field=models.FileField(blank=True, default=None, null=True, upload_to=''),
        ),
    ]
