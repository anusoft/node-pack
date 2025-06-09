import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService might be needed if ItemsService is not mocked deeply

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  // Mock PrismaService to avoid actual database calls
  const mockPrismaService = {
    item: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // Use the mock
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const createItemDto = { name: 'Test Item', description: 'Test Description' };
      const expectedResult = { id: 1, ...createItemDto, createdAt: new Date(), updatedAt: new Date() };

      // Mock the service method
      mockPrismaService.item.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createItemDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createItemDto); // Check if service method was called
    });
  });

  // Add more tests for findAll, findOne, update, remove
  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = [{ id: 1, name: 'Test Item', description: 'Test Description', createdAt: new Date(), updatedAt: new Date() }];
      mockPrismaService.item.findMany.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

});
