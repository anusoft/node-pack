import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

// Mock PrismaService
const mockPrismaService = {
  item: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const dto: CreateItemDto = { name: 'Test', description: 'Test desc' };
      const expectedItem = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.item.create.mockResolvedValue(expectedItem);

      const item = await service.create(dto);
      expect(item).toEqual(expectedItem);
      expect(prisma.item.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const expectedItems = [
        { id: 1, name: 'Test 1', description: 'Desc 1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Test 2', description: 'Desc 2', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrismaService.item.findMany.mockResolvedValue(expectedItems);

      const items = await service.findAll();
      expect(items).toEqual(expectedItems);
      expect(prisma.item.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single item by id', async () => {
      const id = 1;
      const expectedItem = { id: 1, name: 'Test 1', description: 'Desc 1', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.item.findUnique.mockResolvedValue(expectedItem);

      const item = await service.findOne(id);
      expect(item).toEqual(expectedItem);
      expect(prisma.item.findUnique).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const id = 1;
      const dto: UpdateItemDto = { name: 'Updated Test' };
      const expectedItem = { id: 1, name: 'Updated Test', description: 'Desc 1', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.item.update.mockResolvedValue(expectedItem);

      const item = await service.update(id, dto);
      expect(item).toEqual(expectedItem);
      expect(prisma.item.update).toHaveBeenCalledWith({ where: { id }, data: dto });
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const id = 1;
      const expectedItem = { id: 1, name: 'Test 1', description: 'Desc 1', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.item.delete.mockResolvedValue(expectedItem);

      const item = await service.remove(id);
      expect(item).toEqual(expectedItem);
      expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
