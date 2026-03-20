import { NextRequest, NextResponse } from 'next/server';
import { CustomerController } from '@/controllers/CustomerController';

type RouteParams = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const result = await CustomerController.getById(params.id);

  return NextResponse.json(result.body, { status: result.status });
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const body = await request.json();

  const result = await CustomerController.update(params.id, body);

  return NextResponse.json(result.body, { status: result.status });
};

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const result = await CustomerController.remove(params.id);

  return NextResponse.json(result.body, { status: result.status });
};
