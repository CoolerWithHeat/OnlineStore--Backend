# Generated by Django 4.1.7 on 2023-05-24 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProductsBase', '0011_alter_supportstaff_options_threads_messages'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='ChannelLayer',
            field=models.CharField(default='Need Attention here!', max_length=20),
        ),
    ]
