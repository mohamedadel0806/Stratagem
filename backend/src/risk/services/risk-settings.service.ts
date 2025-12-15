import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskSettings } from '../entities/risk-settings.entity';
import { UpdateRiskSettingsDto, RiskSettingsResponseDto } from '../dto/settings/risk-settings.dto';

@Injectable()
export class RiskSettingsService {
  constructor(
    @InjectRepository(RiskSettings)
    private settingsRepository: Repository<RiskSettings>,
  ) {}

  /**
   * Get risk settings for an organization
   * Creates default settings if none exist
   */
  async getSettings(organizationId?: string): Promise<RiskSettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: organizationId ? { organization_id: organizationId } : {},
      relations: ['updater'],
    });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await this.createDefaultSettings(organizationId);
    }

    return this.toResponseDto(settings);
  }

  /**
   * Update risk settings
   */
  async updateSettings(
    updateDto: UpdateRiskSettingsDto,
    userId?: string,
    organizationId?: string,
  ): Promise<RiskSettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: organizationId ? { organization_id: organizationId } : {},
    });

    // If no settings exist, create default settings first
    if (!settings) {
      settings = await this.createDefaultSettings(organizationId);
    }

    // Update the settings
    Object.assign(settings, {
      ...updateDto,
      updated_by: userId,
      version: settings.version + 1,
    });

    const savedSettings = await this.settingsRepository.save(settings);
    return this.toResponseDto(savedSettings);
  }

  /**
   * Reset settings to defaults
   */
  async resetToDefaults(userId?: string, organizationId?: string): Promise<RiskSettingsResponseDto> {
    let settings = await this.settingsRepository.findOne({
      where: organizationId ? { organization_id: organizationId } : {},
    });

    if (settings) {
      await this.settingsRepository.remove(settings);
    }

    const newSettings = await this.createDefaultSettings(organizationId, userId);
    return this.toResponseDto(newSettings);
  }

  /**
   * Get risk level for a given score
   */
  async getRiskLevelForScore(score: number, organizationId?: string): Promise<{
    level: string;
    color: string;
    description: string;
    responseTime: string;
    escalation: boolean;
  } | null> {
    const settings = await this.getSettings(organizationId);
    
    const riskLevel = settings.risk_levels.find(
      level => score >= level.minScore && score <= level.maxScore
    );

    return riskLevel || null;
  }

  /**
   * Check if a risk score exceeds the organization's risk appetite
   */
  async exceedsRiskAppetite(score: number, organizationId?: string): Promise<boolean> {
    const settings = await this.getSettings(organizationId);
    
    if (!settings.enable_risk_appetite) {
      return false;
    }

    return score > settings.max_acceptable_risk_score;
  }

  /**
   * Get active assessment methods
   */
  async getActiveAssessmentMethods(organizationId?: string): Promise<{
    id: string;
    name: string;
    description: string;
    likelihoodScale: number;
    impactScale: number;
    isDefault: boolean;
  }[]> {
    const settings = await this.getSettings(organizationId);
    return settings.assessment_methods.filter(method => method.isActive);
  }

  /**
   * Get default assessment method
   */
  async getDefaultAssessmentMethod(organizationId?: string): Promise<string> {
    const settings = await this.getSettings(organizationId);
    return settings.default_assessment_method;
  }

  /**
   * Get likelihood scale descriptions
   */
  async getLikelihoodScale(organizationId?: string): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    const settings = await this.getSettings(organizationId);
    return settings.likelihood_scale;
  }

  /**
   * Get impact scale descriptions
   */
  async getImpactScale(organizationId?: string): Promise<{
    value: number;
    label: string;
    description: string;
  }[]> {
    const settings = await this.getSettings(organizationId);
    return settings.impact_scale;
  }

  /**
   * Create default settings
   */
  private async createDefaultSettings(organizationId?: string, userId?: string): Promise<RiskSettings> {
    const defaultSettings = this.settingsRepository.create({
      organization_id: organizationId,
      created_by: userId,
      // All other fields use entity defaults
    });

    return await this.settingsRepository.save(defaultSettings);
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(settings: RiskSettings): RiskSettingsResponseDto {
    return {
      id: settings.id,
      organization_id: settings.organization_id,
      risk_levels: settings.risk_levels,
      assessment_methods: settings.assessment_methods,
      likelihood_scale: settings.likelihood_scale,
      impact_scale: settings.impact_scale,
      max_acceptable_risk_score: settings.max_acceptable_risk_score,
      risk_acceptance_authority: settings.risk_acceptance_authority,
      default_review_period_days: settings.default_review_period_days,
      auto_calculate_risk_score: settings.auto_calculate_risk_score,
      require_assessment_evidence: settings.require_assessment_evidence,
      enable_risk_appetite: settings.enable_risk_appetite,
      default_assessment_method: settings.default_assessment_method,
      notify_on_high_risk: settings.notify_on_high_risk,
      notify_on_critical_risk: settings.notify_on_critical_risk,
      notify_on_review_due: settings.notify_on_review_due,
      review_reminder_days: settings.review_reminder_days,
      version: settings.version,
      created_at: settings.created_at?.toISOString(),
      updated_at: settings.updated_at?.toISOString(),
      updated_by_name: settings.updater
        ? `${settings.updater.firstName || ''} ${settings.updater.lastName || ''}`.trim()
        : undefined,
    };
  }
}




