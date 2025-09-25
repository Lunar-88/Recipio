"""Add media_id to Recipe

Revision ID: 088e8dd9c876
Revises: 20b10adb4d67
Create Date: 2025-09-25 17:11:32.415257

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '088e8dd9c876'
down_revision = '20b10adb4d67'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('recipes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('media_id', sa.String(), nullable=True))
        batch_op.create_foreign_key(
            'fk_recipes_media_id',  # ✅ name for the foreign key
            'media',                # target table
            ['media_id'],           # local column
            ['id']                  # remote column
        )

def downgrade():
    with op.batch_alter_table('recipes', schema=None) as batch_op:
        batch_op.drop_constraint('fk_recipes_media_id', type_='foreignkey')
        batch_op.drop_column('media_id')


    # ### end Alembic commands ###
