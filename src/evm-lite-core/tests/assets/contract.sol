pragma solidity ^0.5.3;

contract CrowdFunding {
    struct Funder {
        address addr;
        uint amount;
    }

    struct Campaign {
        address payable beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount;
    }

    Campaign campaign;

    event NewContribution(
        address beneficiary,
        address funder,
        uint amount
    );

    event Settlement(
        bool ok
    );

    constructor(uint amount) public {
        campaign = Campaign({
            beneficiary: msg.sender,
            fundingGoal: amount,
            numFunders: 0,
            amount:0
        });
    }

    function contribute() public payable {
        campaign.amount += msg.value;

        emit NewContribution(campaign.beneficiary, msg.sender, msg.value);
    }

    function checkGoalReached() public view returns
	(bool reached, address beneficiary, uint goal, uint amount) {
        if (campaign.amount < campaign.fundingGoal)
            return (
				false,
				campaign.beneficiary,
				campaign.fundingGoal,
				campaign.amount
			);
        else
            return (
				true,
				campaign.beneficiary,
				campaign.fundingGoal,
				campaign.amount
			);
    }

    function settle() public {
        if (campaign.amount >= campaign.fundingGoal) {
            uint am = campaign.amount;

            campaign.amount = 0;
            campaign.beneficiary.transfer(am);

            emit Settlement(true);
        } else {
            emit Settlement(false);
        }
    }
}
