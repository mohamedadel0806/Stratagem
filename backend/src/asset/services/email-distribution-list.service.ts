import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EmailDistributionList } from '../entities/email-distribution-list.entity';
import { CreateEmailDistributionListDto } from '../dto/create-email-distribution-list.dto';
import { UpdateEmailDistributionListDto } from '../dto/update-email-distribution-list.dto';
import { ReportFormat } from '../entities/report-template.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class EmailDistributionListService {
  private readonly logger = new Logger(EmailDistributionListService.name);

  constructor(
    @InjectRepository(EmailDistributionList)
    private distributionListRepository: Repository<EmailDistributionList>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateEmailDistributionListDto, userId: string): Promise<EmailDistributionList> {
    const distributionList = this.distributionListRepository.create({
      ...dto,
      createdById: userId,
    });

    // Link users if provided
    if (dto.userIds && dto.userIds.length > 0) {
      const users = await this.userRepository.find({
        where: { id: In(dto.userIds) },
      });
      distributionList.users = users;
    }

    return this.distributionListRepository.save(distributionList);
  }

  async findAll(): Promise<EmailDistributionList[]> {
    return this.distributionListRepository.find({
      relations: ['createdBy', 'users'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EmailDistributionList> {
    const distributionList = await this.distributionListRepository.findOne({
      where: { id },
      relations: ['createdBy', 'users'],
    });

    if (!distributionList) {
      throw new NotFoundException(`Email distribution list with ID ${id} not found`);
    }

    return distributionList;
  }

  async update(id: string, dto: UpdateEmailDistributionListDto): Promise<EmailDistributionList> {
    const distributionList = await this.findOne(id);
    Object.assign(distributionList, dto);
    return this.distributionListRepository.save(distributionList);
  }

  async delete(id: string): Promise<void> {
    const distributionList = await this.findOne(id);
    await this.distributionListRepository.remove(distributionList);
  }

  async sendReportEmail(
    emailAddresses: string[],
    reportName: string,
    reportBuffer: Buffer,
    format: ReportFormat,
    filename: string,
  ): Promise<void> {
    // TODO: Integrate with actual email service (e.g., nodemailer, SendGrid, AWS SES)
    // For now, this is a placeholder that logs the email details
    this.logger.log(`Sending report "${reportName}" to ${emailAddresses.length} recipients`);
    this.logger.log(`Report format: ${format}, Filename: ${filename}`);
    this.logger.log(`Report buffer size: ${reportBuffer.length} bytes`);

    // In production, this would:
    // 1. Report file is already generated as buffer
    // 2. Create email with attachment
    // 3. Send to all recipients in the distribution list
    // Example with nodemailer:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({
    //   to: emailAddresses,
    //   subject: `Report: ${reportName}`,
    //   text: `Please find attached the ${reportName} report.`,
    //   attachments: [{ filename, content: reportBuffer }]
    // });
  }
}



