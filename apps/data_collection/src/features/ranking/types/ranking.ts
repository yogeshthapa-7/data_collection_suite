export interface RankingCondition {
  RankingConditionID: number
  CategoryID: number
  Group: string
  Expression: string
  Operator: string
  MatchMarks: string
  NotMatchMarks: string
  OrderKey: number
}

export interface RankingCriteriaSelectItem {
  RankingCriteriaID: number
  CriteriaName: string
}